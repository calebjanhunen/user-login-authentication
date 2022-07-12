export function getData(req, res) {
    console.log(req.userId);
    res.send("success");
}
