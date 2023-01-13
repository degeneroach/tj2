// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { supabase } from "../../utils/supabase.js";

export default async function handler(req, res) {
    let email = req.body.email;
    const { data, error } = await supabase
        .from("tattoo-jenny-emails")
        .insert([{ email: email }]);
    if (error) {
        console.log({ supabaseError: error });
        res.status(500).json(error);
    }
    if (data) {
        console.log({ supabaseData: data });
        res.status(200).json(data);
    }
    res.status(200).json({data, error});
  }
  