export async function FetchRegister(data: any, journalId: string) {
  try {
    const res = await fetch("http://localhost:8000/api/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, journal_id: journalId }),
    });

    const result = await res.json();
    console.log("Réponse du serveur :", result);

    return { success: res.ok, result };
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    return { success: false, result: null, error };
  }
}
