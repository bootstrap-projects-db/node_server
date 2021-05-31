// all the controller and utility functions here:

export async function add(req, res) {
  const sum = 1 + 3;

  res.send(sum.toString());
}

export async function subtract(req, res) {
  const difference = 9 - 5;

  res.send(difference.toString());
}
