export function GetGreetingByTimezone() {
    const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

    const hour = new Date(now).getHours();

    if (hour >= 5 && hour < 12) {
        return "☀️";
    } else if (hour >= 12 && hour < 17) {
        return "🌤️";
    } else {
        return "🌙";
    }
}