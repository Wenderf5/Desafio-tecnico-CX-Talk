export async function verifySession(): Promise<boolean> {
    try {
        const response = await fetch("http://localhost:8080/auth/validate-session", {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            return false;
        }

        return true;
    } catch (error) {
        return false;
    }
}