import type { IContainerPlugin } from "../Core/Interfaces/IContainerPlugin";
import type { IPlugin } from "../Core/Interfaces/IPlugin";
import type { Container } from "../Core/Container";
import type { RecursivePartial } from "../Types";
import type { IOptions } from "../Options/Interfaces/IOptions";
import type { IShapeDrawer } from "../Core/Interfaces/IShapeDrawer";
import type { Options } from "../Options/Classes/Options";
import type { INoise } from "../Core/Interfaces/INoise";
import type { IParticleUpdater } from "../Core/Interfaces/IParticleUpdater";
import type { IInteractor } from "../Core/Interfaces/IInteractor";

type InteractorInitializer = (container: Container) => IInteractor;
type UpdaterInitializer = (container: Container) => IParticleUpdater;

const plugins: IPlugin[] = [];
const interactorsInitializers: InteractorInitializer[] = [];
const updatersInitializers: UpdaterInitializer[] = [];
const interactors: Map<Container, IInteractor[]> = new Map<Container, IInteractor[]>();
const updaters: Map<Container, IParticleUpdater[]> = new Map<Container, IParticleUpdater[]>();
const presets: Map<string, RecursivePartial<IOptions>> = new Map<string, RecursivePartial<IOptions>>();
const drawers: Map<string, IShapeDrawer> = new Map<string, IShapeDrawer>();
const noiseGenerators: Map<string, INoise> = new Map<string, INoise>();

/**
 * @category Utils
 */
export class Plugins {
    public static getPlugin(plugin: string): IPlugin | undefined {
        return plugins.find((t) => t.id === plugin);
    }

    public static addPlugin(plugin: IPlugin): void {
        if (!Plugins.getPlugin(plugin.id)) {
            plugins.push(plugin);
        }
    }

    public static getAvailablePlugins(container: Container): Map<string, IContainerPlugin> {
        const res = new Map<string, IContainerPlugin>();

        for (const plugin of plugins) {
            if (!plugin.needsPlugin(container.options)) {
                continue;
            }
            res.set(plugin.id, plugin.getPlugin(container));
        }

        return res;
    }

    public static loadOptions(options: Options, sourceOptions: RecursivePartial<IOptions>): void {
        for (const plugin of plugins) {
            plugin.loadOptions(options, sourceOptions);
        }
    }

    public static getPreset(preset: string): RecursivePartial<IOptions> | undefined {
        return presets.get(preset);
    }

    public static addPreset(presetKey: string, options: RecursivePartial<IOptions>): void {
        if (!Plugins.getPreset(presetKey)) {
            presets.set(presetKey, options);
        }
    }

    public static addShapeDrawer(type: string, drawer: IShapeDrawer): void {
        if (!Plugins.getShapeDrawer(type)) {
            drawers.set(type, drawer);
        }
    }

    public static getShapeDrawer(type: string): IShapeDrawer | undefined {
        return drawers.get(type);
    }

    public static getSupportedShapes(): IterableIterator<string> {
        return drawers.keys();
    }

    public static getNoiseGenerator(type: string): INoise | undefined {
        return noiseGenerators.get(type);
    }

    public static addNoiseGenerator(type: string, noiseGenerator: INoise): void {
        if (!Plugins.getNoiseGenerator(type)) {
            noiseGenerators.set(type, noiseGenerator);
        }
    }

    public static getInteractors(container: Container): IInteractor[] {
        let res = interactors.get(container);

        if (!res) {
            res = interactorsInitializers.map((t) => t(container));

            interactors.set(container, res);
        }

        return res;
    }

    public static addInteractor(initInteractor: (container: Container) => IInteractor): void {
        interactorsInitializers.push(initInteractor);
    }

    public static getUpdaters(container: Container): IParticleUpdater[] {
        let res = updaters.get(container);

        if (!res) {
            res = updatersInitializers.map((t) => t(container));

            updaters.set(container, res);
        }

        return res;
    }

    public static addParticleUpdater(initUpdater: (container: Container) => IParticleUpdater): void {
        updatersInitializers.push(initUpdater);
    }
}