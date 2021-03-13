import { Command } from "./command";

export interface Plugin {
    name: string;

    description?: string;
    hideFromHelp?: boolean;

    availableCommands?: {
        [id: string]: {
            args?: string[];
            description: string;
        };
    };

    onLogin?: (client: any, plugins?: Plugin[]) => void;

    onMessage?: (client: any, message: any, plugins?: Plugin[]) => void;

    onCommand?: (
        client: any,
        message: any,
        command: Command,
        plugins?: Plugin[]
    ) => void;
}
