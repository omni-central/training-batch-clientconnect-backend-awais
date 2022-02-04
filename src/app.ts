import express from "express";
const app = express();
const PORT = 3000;
app.get("", (req: any, res: any) => {
  res.send("Hello world");
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
