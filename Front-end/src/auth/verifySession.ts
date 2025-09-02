export async function verifySession(): Promise<boolean> {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACK_END_ENDPOINT}/auth/validate-session`, {
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