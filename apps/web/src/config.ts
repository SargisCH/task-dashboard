interface Config {
    useCookies: boolean;
    api: {
        host: string;
        port: number;
    };
}

export const config: Config = {
    useCookies: true,

    api: {
        host: import.meta.env.VITE_WEB_API_URL ?? 'http://localhost',
        port: import.meta.env.VITE_WEB_API_PORT ?? 3000,
    },
};
