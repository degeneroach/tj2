const axios = require("axios");
const AWS = require("aws-sdk");
import { supabase } from "../../utils/supabase";

const s3Bucket = "tattoo-jenny-images";
const accessKeyId = "AKIAUBOF3S3XHUDKNQZK";
const secretAccessKey = process.env.AWS_SECRET;

const s3Options = {
  accessKeyId,
  secretAccessKey,
  region: "us-east-1",
};

const s3 = new AWS.S3(s3Options);

export default async function handler(req, res) {
  const { generatedTattoos, prompt, creator } = req.body;
  // Fetch image base 64 from blob
  console.log({ generatedTattoos });
  let generatedTattoosArray = generatedTattoos.data;
  const imagePromises = generatedTattoosArray.map(async (tattoo) => {
    const response = await axios.get(tattoo.url, {
      responseType: "arraybuffer",
    });
    return response.data;
  });
  const images = await Promise.all(imagePromises);
  // Upload to S3
  const s3Promises = images.map(async (image, index) => {
    const params = {
      Bucket: s3Bucket,
      Key: `${Date.now()}-${index}.png`,
      Body: image,
      ContentEncoding: "base64",
      ContentType: "image/png",
    };
    return s3.upload(params).promise();
  });
  const s3Uploads = await Promise.all(s3Promises);
  const s3URIs = s3Uploads.map((upload) => upload.Location);
  // save to supabase one at a time
  try {
    const supabasePromises = s3URIs.map(async (uri) => {
      const { data, error } = await supabase
        .from("tattoo-jenny-images")
        .insert([{ image: uri, prompt, ranking: 3, creator: creator }]);
      if (error) {
        console.log({ supabaseError: error });
      }
      if (data) {
        console.log({ supabaseData: data });
      }
      return { data, error };
    });
    const supabaseUploads = await Promise.all(supabasePromises);
    res.status(200).json("Uploaded!");
  } catch (error) {
    console.log({ error });
    res.status(500).json(error);
  }
}