const API = "https://medi-sure-2.onrender.com/api";

const medicineModal = document.getElementById("medicineModal");
const scannerModal = document.getElementById("scannerModal");
const medicineForm = document.getElementById("medicineForm");
const video = document.getElementById("scannerVideo");

let scannerStream = null;
let barcodeDetector = null;
let scanning = false;


function openManual() {
    medicineModal.classList.add("active");
}


function closeModal() {
    medicineModal.classList.remove("active");
}


function openScanner() {
    scannerModal.classList.add("active");
}


function closeScanner() {
    scannerModal.classList.remove("active");
    stopScanner();
}


function openManualFromScanner() {
    closeScanner();
    openManual();
}


medicineForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    const medicine = {
        gtin: document.getElementById("gtin").value.trim(),
        medicine_name: document.getElementById("medicineName").value.trim(),
        manufacturer: document.getElementById("manufacturer").value.trim(),
        strength: document.getElementById("strength").value.trim(),
        dosage_form: document.getElementById("dosageForm").value.trim(),
        batch_number: document.getElementById("batchNumber").value.trim()
    };


    try {

        const response = await fetch(`${API}/medicines`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(medicine)
        });


        const data = await response.json();


        if (!response.ok) {
            alert(data.message);
            return;
        }


        medicineForm.reset();

        closeModal();

        showToast();

        loadMedicines();

    } catch (error) {

        alert("Cannot connect to Medi Sure database");

    }
});


async function loadMedicines() {

    try {

        const response =
            await fetch(`${API}/medicines`);

        const medicines =
            await response.json();


        const list =
            document.getElementById("medicineList");


        document.getElementById("totalMedicines")
            .textContent = medicines.length;


        list.innerHTML = medicines
            .slice(0, 5)
            .map(medicine => `
                <tr>
                    <td>${escapeHTML(medicine.medicine_name)}</td>

                    <td>${escapeHTML(medicine.manufacturer)}</td>

                    <td>${escapeHTML(medicine.strength)}</td>

                    <td>
                        ${new Date(medicine.createdAt)
                            .toLocaleDateString("en-IN")}
                    </td>
                </tr>
            `)
            .join("");


    } catch (error) {

        console.log("Database connection failed");

    }
}


// async function findMedicine(gtin) {

//     try {

//         const response =
//             await fetch(`${API}/medicines/${encodeURIComponent(gtin)}`);


//         if (response.status === 404) {

//             alert(
//                 "Medicine not found in Medi Sure database."
//             );

//             return false;
//         }


//         const data =
//             await response.json();


//         const medicine =
//             data.medicine;


//         document.getElementById("medicineName").value =
//             medicine.medicine_name;

//         document.getElementById("manufacturer").value =
//             medicine.manufacturer;

//         document.getElementById("strength").value =
//             medicine.strength;

//         document.getElementById("gtin").value =
//             medicine.gtin;


//         return true;


//     } catch (error) {

//         alert(
//             "Cannot connect to Medi Sure database."
//         );

//         return false;
//     }
// }


async function startScanner() {

    if (!("BarcodeDetector" in window)) {

        document.getElementById("scanStatus")
            .textContent =
            "Barcode scanning is not supported in this browser.";

        return;
    }


    try {

        scannerStream =
            await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: {
                        ideal: "environment"
                    }
                }
            });


        video.srcObject = scannerStream;


        barcodeDetector =
            new BarcodeDetector({
                formats: [
                    "qr_code",
                    "ean_13",
                    "ean_8",
                    "code_128",
                    "upc_a",
                    "upc_e"
                ]
            });


        scanning = true;

        scanBarcode();


    } catch (error) {

        document.getElementById("scanStatus")
            .textContent =
            "Camera permission is required.";

    }
}


async function scanBarcode() {

    if (!scanning) {
        return;
    }


    try {

        const codes =
            await barcodeDetector.detect(video);


        if (codes.length > 0) {

            const value =
                codes[0].rawValue.trim();


            stopScanner();

            document.getElementById("scanStatus")
                .textContent =
                "Barcode detected!";


            closeScanner();


            document.getElementById("gtin").value = value;
            openManual();
            document.getElementById("scanStatus")
            .textContent = "GTIN detected!";
            showScanSuccess();
            return;
        }


    } catch (error) {

        console.log(error);

    }


    requestAnimationFrame(scanBarcode);
}


function stopScanner() {

    scanning = false;


    if (scannerStream) {

        scannerStream
            .getTracks()
            .forEach(track => track.stop());

        scannerStream = null;
    }


    video.srcObject = null;
}


function showScanSuccess() {

    const toast =
        document.getElementById("toast");


    toast.innerHTML = `
        <span>✓</span>

        <div>
            <strong>Medicine found!</strong>

            <p>
                Details loaded from Medi Sure database.
            </p>
        </div>
    `;


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);
}


function showToast() {

    const toast =
        document.getElementById("toast");


    toast.innerHTML = `
        <span>✓</span>

        <div>
            <strong>Medicine added successfully!</strong>

            <p>
                The medicine has been added to the database.
            </p>
        </div>
    `;


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 3500);
}


function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


window.addEventListener("click", function(e) {

    if (e.target === medicineModal) {
        closeModal();
    }


    if (e.target === scannerModal) {
        closeScanner();
    }

});


loadMedicines();