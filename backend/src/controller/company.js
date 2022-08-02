const Company = require("../models/company");
const auth = require("../middleware/auth");
const moment = require("moment");

exports.AddCompany = async (req, res) => {
  const {
    company_name,
    company_address,
    country,
    industry,
    province,
    postal_code,
    city,
  } = req.body;
  try {
    const company = await Company.findOne({
      company_name: company_name,
    });
    if (company) {
      return res.status(409).json({
        success: false,
        message: "Company already exist",
      });
    } else {
      const companies = new Company({
        company_name: company_name,
        company_address: company_address,
        country: country,
        industry: industry,
        province: province,
        company_img: `${req.dir}/${req.fileName}`,
        postal_code: postal_code,
        city: city,
      });
      companies
        .save()
        .then((data) => {
          res.status(201).json({
            success: true,
            msg: "Company created Succesfully",
            company: data,
          });
        })
        .catch((e) => {
          res.status(500).json({
            success: false,
            msg: "something went wrong",
            error: e,
          });
        });
    }
  } catch (e) {
    console.log("error in add company", e);
  }
};
exports.getCompanies = async (req, res) => {
  try {
    const comapny = await Company.findById(req.companyId).populate(
      "company_users",
      "first_name last_name email userType"
    );
    if (comapny) {
      res.status(200).json({
        success: true,
        message: "get successfully",
        data: comapny,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  } catch (e) {
    console.log("error in fetch company", e);
  }
};
exports.UpdateCompanies = async (req, res) => {
  const { company_name, description } = req.body;
  let obj = {};
  try {
    const existingCompany = await Company.findById(req.companyId);
    let obj = {};
    if (existingCompany) {
      if (company_name === existingCompany.company_name) {
        res.json({
          success: false,
          message: "Compnay name already axists",
        });
      } else {
        if (company_name != "undefined") {
          obj.company_name = company_name;
        } else {
          obj.company_name = existingCompany.company_name;
        }
      }

      if (description === "undefined") {
        obj.description = existingCompany.description;
      } else {
        obj.description = description;
      }
      if (req.fileName) {
        obj.company_img = `${req.dir}/${req.fileName}`;
      }
      const UpdateCompany = await Company.updateOne(
        { _id: req.companyId },
        {
          company_name: obj.company_name
            ? obj.company_name
            : existingCompany.company_name,
          company_img: obj.company_img
            ? obj.company_img
            : existingCompany.company_img,
          description: obj.description
            ? obj.description
            : existingCompany.description,
        }
      );
      if (UpdateCompany) {
        res.status(200).json({
          success: true,
          msg: "Company updated",
        });
      } else {
        res.json({
          success: false,
          msg: "something went wrong",
        });
      }
    }
  } catch (e) {
    console.log("error in update company", e);
  }
};
exports.getAllCompanies = async (req, res) => {
  console.log("out");
  try {
    const comapny = await Company.find().select("_id company_name");
    if (comapny) {
      res.status(200).json({
        success: true,
        message: "get successfully",
        data: comapny,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  } catch (e) {
    console.log("error in fetch company", e);
  }
};
