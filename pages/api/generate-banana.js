// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { supabase } from "../../utils/supabase.js";
const banana = require("@banana-dev/banana-dev");

const bananaAPIKey = process.env.BANANA_API_KEY;
const bananaModelKey = process.env.BANANA_MODEL_KEY;

export default async function handler(req, res) {
  let prompt = req.body.prompt;
  let style = req.body.style;
  let speed = req.body.speed;
  let magic = req.body.magic;
  switch (style) {
    case "normal":
      prompt = `a tattoo of ${prompt}`;
      break;
    case "old school":
      prompt = `a tattoo of ${prompt}, ultra detailed, old school style`;
      break;
    case "neotraditional":
      prompt = `a tattoo of ${prompt}, ultra detailed, colorful, neotraditional style`;
      break;
    case "fine line":
      prompt = `a minimal tattoo of ${prompt}, ultra detailed, intricate, delicate, minimal, fine line style`;
      break;
    case "tribal":
      prompt = `a tribal tattoo of ${prompt}, ultra detailed, tribal style`;
      break;
    case "realism":
      prompt = `a realistic tattoo of ${prompt}, ultra detailed, intricate, realism style`;
      break;
    case "blackwork":
      prompt = `a tattoo of ${prompt}, ultra detailed, blackwork style`;
      break;
    case "japanese":
      prompt = `a japanese style tattoo of ${prompt}, ultra detailed`;
      break;
    case "geometric":
      prompt = `a geometric tattoo of ${prompt}, ultra detailed, intricate, geometric style`;
      break;
    case "cartoon":
      prompt = `a silly cartoon tattoo of ${prompt}, ultra detailed, bright, colorful, cartoon style`;
      break;
    case "sketch":
      prompt = `a sketchy tattoo of ${prompt}, ultra detailed, sketch style`;
      break;
    case "watercolor":
      prompt = `a watercolor tattoo of ${prompt}, ultra detailed, watercolor style`;
      break;
    default:
      prompt = `a tattoo of ${prompt}`;
      break;
  }
  
  let inference_steps = 25;
  switch (speed) {
    case "very fast":
      inference_steps = 10;
      break;
    case "fast":
      inference_steps = 18;
      break;
    case "very slow":
      inference_steps = 50;
      break;
    case "slow":
      inference_steps = 38;
      break;
    default:
      inference_steps = 25;
      break;
  }
  let guidance_scale = 5;
  switch (magic) {
    case "very high":
      guidance_scale = 10;
      break;
    case "very low":
      guidance_scale = 2;
      break;
    case "high":
      guidance_scale = 8;
      break;
    case "low":
      guidance_scale = 3;
      break;
    default:
      guidance_scale = 5;
      break;
  }

  try {
    let response = [];
    for (let i = 0; i < 6; i++) {
      const model_inputs = {
        prompt,
        num_inference_steps: inference_steps,
        guidance_scale: guidance_scale,
        height: 512,
        width: 512,
        seed: Math.floor(Math.random() * 100000),
      };
      const out = await banana.run(bananaAPIKey, bananaModelKey, model_inputs);
      response[i] = {
        image: out.modelOutputs[0].image_base64,
        seed: model_inputs.seed,
        magic,
        speed,
        prompt,
      };
    }
    res.status(200).json(response);
  } catch (error) {
    console.log({ error });
    res.status(500).json({msg: "Banana.Dev Failed", error});
  }
}
