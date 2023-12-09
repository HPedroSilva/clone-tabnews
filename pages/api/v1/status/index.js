function status(request, response) {
  response.status(200).json({ a: "média" });
}

export default status;
