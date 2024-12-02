async function getAuth() {
  try {
    const response = await fetch("./api/auth");

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    return null;
  }
}

export { getAuth };
