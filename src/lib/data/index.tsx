export const getData = async (url: string) => {
  const res = await fetch(url, {
    cache: "no-store",
  });

  if (res.ok) {
    console.log("Success");
  } else {
    console.log("Failure");
  }

  return res.json();
};
