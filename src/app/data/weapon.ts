export interface Weapon {
    name: string;
    attack: number;
    damage: number;
    dodge: number;
    health: number;
    image: string;
}

export interface WeaponId extends Weapon { id: string; }