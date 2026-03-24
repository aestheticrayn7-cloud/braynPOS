async function test() {
  const res = await fetch("http://127.0.0.1:8080/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@brayn.app", password: "Admin@123" })
  });
  console.log('Status:', res.status);
  console.log(await res.text());
}
test();
