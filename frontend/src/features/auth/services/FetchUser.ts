

export async function FetchUser(email: string, password: string, journalId: string) {
  const res = await fetch("http://localhost:8000/api/login/", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, journal_id: journalId }),
  });
  const data = await res.json();
  return { success: res.ok, data };
}
