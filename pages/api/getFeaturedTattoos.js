// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { supabase } from "../../utils/supabase";

export default async function handler(req, res) {
  const page = req.body.page;
  // fetch tattoos from supabase
  let fromPage;
  let toPage;
  if (page === 1) {
      fromPage = 1;
      toPage = 18;
  }
  if (page >= 2) {
      fromPage = (page - 1) * 18;
      toPage = (page * 18) - 1;
  }
  const supabaseResponse = await supabase
    .from("tattoo-jenny-images")
    .select("*")
    .order("id", { ascending: false })
    .eq("isCherrypicked", true)
    .range(fromPage, toPage);
  if (supabaseResponse?.error) {
    console.log({ supabaseError: supabaseResponse?.error });
    res.status(500).json(supabaseResponse?.error);
  }
  if (supabaseResponse?.data) {
    res.status(200).json(supabaseResponse?.data);
  }
}
