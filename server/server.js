const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


const medicineSchema = new mongoose.Schema({
    gtin: {
        type: String,
        required: true,
        unique: true
    },

    medicine_name: {
        type: String,
        required: true
    },

    manufacturer: {
        type: String,
        required: true
    },

    strength: {
        type: String,
        required: true
    },

    dosage_form: {
        type: String,
        default: ""
    }

}, {
    timestamps: true
});


const Medicine = mongoose.model(
    "Medicine",
    medicineSchema
);


mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected");

        app.listen(process.env.PORT, () => {
            console.log(
                `Server running on port ${process.env.PORT}`
            );
        });
    })
    .catch((error) => {
        console.log("MongoDB connection failed");
        console.log(error.message);
    });


app.get("/", (req, res) => {
    res.json({
        message: "Medi Sure server is running"
    });
});


app.get("/api/medicines", async (req, res) => {

    try {

        const medicines = await Medicine
            .find()
            .sort({ createdAt: -1 });

        res.json(medicines);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch medicines"
        });

    }

});


app.get("/api/medicines/:gtin", async (req, res) => {

    try {

        const gtin = req.params.gtin.trim();

        const medicine = await Medicine.findOne({
            gtin: gtin
        });

        if (!medicine) {

            return res.status(404).json({
                found: false,
                message: "Medicine not found"
            });

        }

        res.json({
            found: true,
            medicine: medicine
        });

    } catch (error) {

        res.status(500).json({
            found: false,
            message: "Database error"
        });

    }

});


app.post("/api/medicines", async (req, res) => {

    try {

        const {
            gtin,
            medicine_name,
            manufacturer,
            strength,
            dosage_form
        } = req.body;


        if (
            !gtin ||
            !medicine_name ||
            !manufacturer ||
            !strength
        ) {

            return res.status(400).json({
                message: "Required fields are missing"
            });

        }


        const existingMedicine =
            await Medicine.findOne({
                gtin: gtin
            });


        if (existingMedicine) {

            return res.status(409).json({
                message:
                    "Medicine with this GTIN already exists"
            });

        }


        const medicine =
            await Medicine.create({
                gtin: gtin,
                medicine_name: medicine_name,
                manufacturer: manufacturer,
                strength: strength,
                dosage_form: dosage_form || ""
            });


        res.status(201).json({
            message: "Medicine added successfully",
            medicine: medicine
        });


    } catch (error) {

        if (error.code === 11000) {

            return res.status(409).json({
                message:
                    "Medicine with this GTIN already exists"
            });

        }


        res.status(500).json({
            message: "Failed to add medicine"
        });

    }

});


app.get("/api/medicines/count", async (req, res) => {

    try {

        const count =
            await Medicine.countDocuments();

        res.json({
            count: count
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to get medicine count"
        });

    }

});