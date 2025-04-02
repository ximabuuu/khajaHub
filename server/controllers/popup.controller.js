import PopupModel from "../models/popup.model.js"


export const addPopup = async (req, res) => {
    try {
        const { imageUrl } = req.body
        const newPopup = new PopupModel({ imageUrl })
        await newPopup.save()
        res.status(201).json({
            success: true,
            message: "PopUp added successfully", newPopup
        })
    } catch (error) {
        res.status(500).json({ message: "Error adding PopUp", error })
    }
}


export const getPopUpController = async (req, res) => {
    try {

        const data = await PopupModel.find()

        return res.json({
            data: data,
            error: false,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}