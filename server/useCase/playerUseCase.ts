import type { UserId } from '$/commonTypesWithClient/branded';
import type { PlayerModel } from '$/commonTypesWithClient/models';
import { GAME_SIZE } from '$/constants/gameSize';
import { playersRepository } from '$/repository/playersRepository';
import { userIdParser } from '$/service/idParsers';
import { minMax } from '$/service/minMax';
import { randomUUID } from 'crypto';

export const playerUseCase = {
  create: async (userName: string): Promise<PlayerModel | null> => {
    const newPlayerModel = {
      id: userIdParser.parse(randomUUID()),
      x: Math.floor(Math.random() * GAME_SIZE.WIDTH),
      y: Math.floor(Math.random() * GAME_SIZE.HEIGHT),
      name: userName,
      score: 0,
      isLive: true,
    };
    const res = await playersRepository.save(newPlayerModel);
    if (res === null) {
      return null;
    }
    return res;
  },
  move: async (player: PlayerModel) => {
    const newPlayer = {
      ...player,
      x: minMax(player.x, GAME_SIZE.WIDTH),
      y: minMax(player.y, GAME_SIZE.HEIGHT),
    };
    const res = await playersRepository.save(newPlayer);
    return res;
  },
  getYourState: async (userId: UserId) => {
    const res = await playersRepository.find(userId);
    return res;
  },
  findAll: async () => {
    const res = await playersRepository.findAll();
    return res;
  },
};
