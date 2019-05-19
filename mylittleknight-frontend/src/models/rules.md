# Basic Rules
## Knight
+ id: FemaleKnight | MaleKnight

## Monster
+ id: e.g. Boss1
+ baseHp: 2
  + hp should be around 1 to 
+ baseMinAttack: 3
  + attack should be with
+ baseMaxAttack: 5
+ baseDefense: 5 
  + defense should be within 0 - 10

## Equipment


## Calculation of damage
damage = random(minAttack,maxAttack) * (1-defense\*0.06/(1+defense\*0.06))