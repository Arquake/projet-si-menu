import TokenManager from "../src/Managers/TokenManagement/TokenManager";
import jwt from "jsonwebtoken";

describe('Token Manager - vérification de token', () => {
    it('Le jwt devrait être valide', () => {
      const token = TokenManager.generateJwt(3);
      expect((TokenManager.jwtInfo(token)).uid).toBe(3);
    });
  
    it('Le refresh token devrait être valide', () => {
      const token = TokenManager.generateRefreshToken(3);
      expect((TokenManager.refreshTokenInfo(token)).userUid).toBe(3);
    });
  });