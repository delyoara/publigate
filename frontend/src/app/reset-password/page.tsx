
// 'use client'
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export default function ResetPasswordPage () {
//   const { token } = useRouter().query
//   const [newPassword, setNewPassword] = useState("")

//   const handleSubmit = async () => {
//     await axios.post("/api/reset-password", { token, newPassword })
//     router.push("/login")
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
//       <button type="submit">Changer le mot de passe</button>
//     </form>
//   )
// }
