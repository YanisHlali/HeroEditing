export interface Hero {
    name: string;
    attack: number;
    damage: number;
    dodge: number;
    health: number;
    weapon: string;
    image: string;
}

export interface HeroId extends Hero { id: string; }