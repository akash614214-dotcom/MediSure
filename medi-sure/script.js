const menuBtn = document.getElementById("menuBtn");
const navLinks = document.querySelector(".nav-links");
const scanBtn = document.getElementById("scanBtn");
const manualBtn = document.getElementById("manualBtn");
const contactForm = document.getElementById("contactForm");

const verifyResultModal =
    document.getElementById("verifyResultModal");

const resultClose =
    document.getElementById("resultClose");

resultClose.addEventListener("click", () => {

    verifyResultModal.classList.remove("active");

});


menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("show");
});

scanBtn.addEventListener("click", () => {
    scannerModal.classList.add("active");
    startScanner();
});

const scannerModal =
    document.getElementById("scannerModal");

const scannerClose =
    document.getElementById("scannerClose");

const scannerManual =
    document.getElementById("scannerManual");

const scannerVideo =
    document.getElementById("scannerVideo");

const scanStatus =
    document.getElementById("scanStatus");

let scannerStream = null;
let barcodeDetector = null;
let scanning = false;

scanBtn.addEventListener("click", () => {

    scannerModal.classList.add("active");

    startScanner();

});

scannerClose.addEventListener("click", () => {

    closeScanner();

});

scannerManual.addEventListener("click", () => {

    closeScanner();

    verifyModal.classList.add("active");

    gtinInput.focus();

});

scannerModal.addEventListener("click", (e) => {

    if (e.target === scannerModal) {

        closeScanner();

    }

});

async function startScanner() {

    if (!("BarcodeDetector" in window)) {

        scanStatus.textContent =
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

        scannerVideo.srcObject = scannerStream;

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

        scanStatus.textContent =
            "Scanning...";

        scanBarcode();

    } catch (error) {

        console.log(error);

        scanStatus.textContent =
            "Camera permission is required.";

    }

}

async function scanBarcode() {

    if (!scanning) {
        return;
    }

    try {

        const codes =
            await barcodeDetector.detect(scannerVideo);

        if (codes.length > 0) {

            const value =
                codes[0].rawValue.trim();

            console.log("Scanned:", value);

            const digitsOnly =
                /^\d+$/.test(value);

            if (
                digitsOnly &&
                (value.length === 13 || value.length === 14)
            ) {

                scanStatus.textContent =
                    "GTIN detected. Verifying...";

                stopScanner();

                await verifyScannedGTIN(value);

                return;

            } else {

                scanStatus.textContent =
                    "Invalid code. Please scan a 13 or 14 digit GTIN.";

                setTimeout(() => {

                    if (scanning) {

                        scanStatus.textContent =
                            "Scanning...";

                    }

                }, 2500);

            }

        }

    } catch (error) {

        console.log(error);

    }

    requestAnimationFrame(scanBarcode);

}

async function verifyScannedGTIN(gtin) {

    try {

        const response = await fetch(
            `https://medi-sure-2.onrender.com/api/medicines/${encodeURIComponent(gtin)}`
        );

        const data = await response.json();

        closeScanner();

        if (response.ok && data.found) {

            const medicine = data.medicine;

            document.getElementById("resultMedicine")
                .textContent =
                medicine.medicine_name;

            document.getElementById("resultManufacturer")
                .textContent =
                medicine.manufacturer;

            document.getElementById("resultStrength")
                .textContent =
                medicine.strength;

            document.getElementById("resultGTIN")
                .textContent =
                medicine.gtin;

            document.getElementById("resultDos")
                .textContent =
                medicine.dosage_form;


            verifyResultModal.classList.add("active");

        } else {

            verifyModal.classList.add("active");

            verifyResult.innerHTML = `
                <div class="verify-result verify-danger">

                    <h3>✕ Medicine Not Found</h3>

                    <p>
                        This GTIN is not present in the
                        Medi-Sure database.
                    </p>

                    <p>
                        Scanned GTIN: ${gtin}
                    </p>

                </div>
            `;

        }

    } catch (error) {

        console.log(error);

        closeScanner();

        verifyModal.classList.add("active");

        verifyResult.innerHTML = `
            <div class="verify-result verify-danger">

                <h3>⚠ Connection Error</h3>

                <p>
                    Unable to connect to Medi-Sure server.
                </p>

            </div>
        `;

    }

}

function stopScanner() {

    scanning = false;

    if (scannerStream) {

        scannerStream
            .getTracks()
            .forEach(track => track.stop());

        scannerStream = null;

    }

    scannerVideo.srcObject = null;

}

function closeScanner() {

    stopScanner();

    scannerModal.classList.remove("active");

}

const verifyModal = document.getElementById("verifyModal");
const verifyClose = document.getElementById("verifyClose");
const verifySubmit = document.getElementById("verifySubmit");
const gtinInput = document.getElementById("gtinInput");
const verifyResult = document.getElementById("verifyResult");


manualBtn.addEventListener("click", () => {

    verifyModal.classList.add("active");

    gtinInput.focus();

});


verifyClose.addEventListener("click", () => {

    verifyModal.classList.remove("active");

    gtinInput.value = "";

    verifyResult.innerHTML = "";

});


verifyModal.addEventListener("click", (e) => {

    if (e.target === verifyModal) {

        verifyModal.classList.remove("active");

    }

});


verifySubmit.addEventListener("click", async () => {

    const gtin = gtinInput.value.trim();

    if (!gtin) {

        verifyResult.innerHTML = `
            <div class="verify-result verify-danger">
                <h3>GTIN Required</h3>
                <p>Please enter the GTIN of your medicine.</p>
            </div>
        `;

        return;
    }

    verifySubmit.disabled = true;
    verifySubmit.innerHTML = "Checking...";

    verifyResult.innerHTML = "";

    try {

        const response = await fetch(
            `https://medi-sure-2.onrender.com/api/medicines/${encodeURIComponent(gtin)}`
        );

        const data = await response.json();

        if (response.ok && data.found) {

            const medicine = data.medicine;

            document.getElementById("resultMedicine").textContent =
                medicine.medicine_name;

            document.getElementById("resultManufacturer").textContent =
                medicine.manufacturer;

            document.getElementById("resultStrength").textContent =
                medicine.strength;

            document.getElementById("resultGTIN").textContent =
                medicine.gtin;

            document.getElementById("resultDos").textContent =
                medicine.dosage_form;

            verifyModal.classList.remove("active");

            verifyResultModal.classList.add("active");

        } else {

            verifyResult.innerHTML = `
                <div class="verify-result verify-danger">
                    <h3>✕ Medicine Not Found</h3>

                    <p>
                        This GTIN is not present in the
                        Medi-Sure database.
                    </p>

                    <p>
                        Please check the GTIN and try again.
                    </p>
                </div>
            `;
        }

    } catch (error) {

        console.log(error);

        verifyResult.innerHTML = `
            <div class="verify-result verify-danger">
                <h3>⚠ Connection Error</h3>

                <p>
                    Unable to connect to Medi-Sure server.
                </p>
            </div>
        `;

    } finally {

        verifySubmit.disabled = false;

        verifySubmit.innerHTML = `
            Verify Medicine
            <span>→</span>
        `;

    }

});

contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("contactName").value.trim();
    if (!name) {
        return;
    }
    alert("Thank you for contacting Medi-Sure!");
    contactForm.reset();
});