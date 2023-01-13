// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { openai } from "../../utils/openai.js";
import { supabase } from "../../utils/supabase.js";

export default async function handler(req, res) {
  let prompt = req.body.prompt;
  let style = req.body.style;
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


  let requestConfig = {
    prompt,
    n: 6,
    size: "512x512",
    response_format: "url",
  };
  try {
    const aiRes = await openai.createImage(requestConfig);
    res.status(200).json(aiRes.data);
  } catch (error) {
    console.log({ error });
    res.status(500).json(error);
  }
}
