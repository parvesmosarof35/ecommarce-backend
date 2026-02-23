import {
  aboutus,
  privacypolicys,
  termsConditions,
  socialMediaLinksAddressPhoneEmailTexts,
} from './settings.modal';
import httpStatus from 'http-status';
import {
  TAboutUs,
  TPrivacyPolicy,
  TTermsConditions,
  TSocialMediaLinksAddressPhoneEmailTexts,
} from './settings.interface';
import AppError from '../../errors/AppError';
import { uploadBufferToCloudinary } from '../../utils/cloudinary';

const updateAboutUsIntoDb = async (payload: TAboutUs) => {
  try {
    const aboutText = payload.aboutUs?.trim() ?? '';

    if (!aboutText) {
      await aboutus.deleteMany();
      return { status: true, message: 'AboutUs content cleared successfully' };
    }
    const result = await aboutus.findOneAndUpdate(
      {},
      { aboutUs: aboutText, isDelete: payload.isDelete ?? false },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    return result
      ? { status: true, message: 'AboutUs successfully saved' }
      : { status: false, message: 'Failed to save AboutUs' };
  } catch (error: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update AboutUs in DB',
      error,
    );
  }
};

const findByAboutUsIntoDb = async () => {
  try {
    const result = await aboutus
      .findOne()
      .select('-isDelete -createdAt -updatedAt');

    return result;
  } catch (error: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update about into db',
      error,
    );
  }
};

const  privacyPolicysIntoDb= async (payload: TPrivacyPolicy) => {
  try {
    const privacyPolicyText = payload.PrivacyPolicy?.trim() ?? "";

    if (!privacyPolicyText) {
      await privacypolicys.deleteMany();
      return { status: true, message: "Privacy policy content cleared successfully" };
    }

    const result = await privacypolicys.findOneAndUpdate(
      {},
      { PrivacyPolicy: privacyPolicyText, isDelete: payload.isDelete ?? false },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return result
      ? { status: true, message: "Privacy policy successfully saved" }
      : { status: false, message: "Failed to save privacy policy" };
  } catch (error: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to save privacy policy into DB",
      error
    );
  }
};


const findByPrivacyPolicyssIntoDb = async () => {
  try {
    const result = await privacypolicys
      .findOne()
      .select('-isDelete -createdAt -updatedAt');

    return result;
  } catch (error: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update about into db',
      error,
    );
  }
};

// termsConditions


const termsConditionsIntoDb = async (payload: TTermsConditions) => {
  try {
    const termsConditionsText = payload.TermsConditions?.trim() ?? "";

    if (!termsConditionsText) {
      await termsConditions.deleteMany();
      return { status: true, message: "Terms and Conditions content cleared successfully" };
    }

    const result = await termsConditions.findOneAndUpdate(
      {},
      { TermsConditions: termsConditionsText, isDelete: payload.isDelete ?? false },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return result
      ? { status: true, message: "Terms and Conditions successfully saved" }
      : { status: false, message: "Failed to save Terms and Conditions" };
  } catch (error: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to save Terms and Conditions into DB",
      error
    );
  }
};


const findBytermsConditionsIntoDb = async () => {
  try {
    const result = await termsConditions
      .findOne()
      .select('-isDelete -createdAt -updatedAt');

    return result;
  } catch (error: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update  termsConditions into db',
      error,
    );
  }
};



const socalMediaLinksAddressPhoneEmailTextsIntoDb = async (
  payload: TSocialMediaLinksAddressPhoneEmailTexts,
) => {
  try {
    const result = await socialMediaLinksAddressPhoneEmailTexts.findOneAndUpdate(
      {},
      payload,
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    return result
      ? { status: true, message: 'Settings successfully saved' }
      : { status: false, message: 'Failed to save Settings' };
  } catch (error: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to save Settings into DB',
      error,
    );
  }
};

const findBySocalMediaLinksAddressPhoneEmailTextsIntoDb = async () => {
  try {
    const result = await socialMediaLinksAddressPhoneEmailTexts
      .findOne()
      .select('-isDelete -createdAt -updatedAt');

    return result;
  } catch (error: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to find settings in db',
      error,
    );
  }
};


const updateHomePageSection2IntoDb = async (
  payload: any,
  files: any
) => {
  try {
    const { title, subtitle, imageoneFile, imagetwoFile, imagethreeFile } = payload;
    
    // Handle image uploads to Cloudinary
    let imageoneUrl = '';
    let imagetwoUrl = '';
    let imagethreeUrl = '';

    // Upload imageone to Cloudinary
    if (imageoneFile && imageoneFile.buffer) {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const filename = `homepage-section2-imageone-${timestamp}-${randomString}`;
      
      const uploaded = await uploadBufferToCloudinary(
        imageoneFile.buffer,
        'homepage-section-2',
        'high',
        filename
      );
      
      imageoneUrl = uploaded.secure_url;
    }

    // Upload imagetwo to Cloudinary
    if (imagetwoFile && imagetwoFile.buffer) {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const filename = `homepage-section2-imagetwo-${timestamp}-${randomString}`;
      
      const uploaded = await uploadBufferToCloudinary(
        imagetwoFile.buffer,
        'homepage-section-2',
        'high',
        filename
      );
      
      imagetwoUrl = uploaded.secure_url;
    }

    // Upload imagethree to Cloudinary
    if (imagethreeFile && imagethreeFile.buffer) {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const filename = `homepage-section2-imagethree-${timestamp}-${randomString}`;
      
      const uploaded = await uploadBufferToCloudinary(
        imagethreeFile.buffer,
        'homepage-section-2',
        'high',
        filename
      );
      
      imagethreeUrl = uploaded.secure_url;
    }

    const result = await socialMediaLinksAddressPhoneEmailTexts.findOneAndUpdate(
      {},
      {
        'homepagesection2.title': title,
        'homepagesection2.subtitle': subtitle,
        'homepagesection2.imageone': imageoneUrl,
        'homepagesection2.imagetwo': imagetwoUrl,
        'homepagesection2.imagethree': imagethreeUrl,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return result
      ? { status: true, message: 'Home Page Section 2 successfully saved' }
      : { status: false, message: 'Failed to save Home Page Section 2' };
  } catch (error: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to save Home Page Section 2 into DB',
      error,
    );
  }
};

const findByHomePageSection2IntoDb = async () => {
  try {
    const result = await socialMediaLinksAddressPhoneEmailTexts
      .findOne()
      .select('-isDelete -createdAt -updatedAt');

    // Transform the data to match the expected interface format
    if (result) {
      const transformedResult = {
        homepagesection2: {
          title: (result as any)['homepagesection2.title'] || '',
          subtitle: (result as any)['homepagesection2.subtitle'] || '',
          imageone: (result as any)['homepagesection2.imageone'] || '',
          imagetwo: (result as any)['homepagesection2.imagetwo'] || '',
          imagethree: (result as any)['homepagesection2.imagethree'] || '',
        }
      };
      
      return transformedResult;
    }

    return result;
  } catch (error: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to find Home Page Section 2 in db',
      error,
    );
  }
};

const SettingServices = {
  updateAboutUsIntoDb,
  findByAboutUsIntoDb,
  privacyPolicysIntoDb,
  findByPrivacyPolicyssIntoDb,
  termsConditionsIntoDb,
  findBytermsConditionsIntoDb,
  socalMediaLinksAddressPhoneEmailTextsIntoDb,
  findBySocalMediaLinksAddressPhoneEmailTextsIntoDb,
  updateHomePageSection2IntoDb,
  findByHomePageSection2IntoDb,
};



export default SettingServices;