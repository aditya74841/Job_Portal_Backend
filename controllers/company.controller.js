import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(400).json({
        message: "Company name is required.",
        success: false,
      });
    }
    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res.status(400).json({
        message: "You can't register same company.",
        success: false,
      });
    }
    company = await Company.create({
      name: companyName,
      userId: req.id,
    });

    return res.status(201).json({
      message: "Company registered successfully.",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getCompany = async (req, res) => {
  try {
    const userId = req.id; // logged in user id
    const companies = await Company.find({ userId });
    if (!companies) {
      return res.status(404).json({
        message: "Companies not found.",
        success: false,
      });
    }
    return res.status(200).json({
      companies,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
// get company by id
export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }
    return res.status(200).json({
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteCompany = async (req, res) => {
  try {
    // console.log("checking")
    const companyId = req.params.id;
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company not found with this Id.",
        success: false,
      });
    }

    await company.deleteOne();
    return res.status(200).json({
      message: "Company deleted successfullyy",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const companyId = req.params.id;

    // Find the company by ID
    // const company = await Company.findById(companyId);
    const company = await Company.find({ _id: companyId });
    // console.log(company);
    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }

    const file = req.file;
    let logo = company.logo;

    // Upload new logo to Cloudinary if file is provided
    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      logo = cloudResponse.secure_url;
    }

    // Prepare update data
    const updateData = {
      name,
      description,
      website,
      location,
      logo,
    };

    // Update company details
    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      updateData,
      {
        new: true,
      }
    );

    // Return updated company data
    return res.status(200).json({
      message: "Company information updated.",
      success: true,
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Error updating company:", error);

    // Handle error based on the error type
    const errorMessage =
      error.response?.data?.message || error.message || "An error occurred.";
    return res.status(500).json({
      message: errorMessage,
      success: false,
    });
  }
};
