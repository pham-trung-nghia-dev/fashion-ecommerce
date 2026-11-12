<?php

namespace App\Services;

use App\Models\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Throwable;

class JwtService
{
    /**
     * Thuật toán mã hóa JWT mặc định
     */
    private const ALGO = 'HS256';

    /**
     * Thời gian sống của JWT (Mặc định: 7 ngày tính theo giây)
     */
    private const TTL = 60 * 60 * 24 * 7;

    /**
     * Lấy Secret Key dùng để ký token
     */
    private static function getSecret(): string
    {
        $secret = env('JWT_SECRET', config('app.key', 'fashion-ecommerce-secret-key-32chars!'));
        // Loại bỏ tiền tố base64: nếu có
        if (str_starts_with($secret, 'base64:')) {
            $secret = base64_decode(substr($secret, 7));
        }
        return $secret;
    }

    /**
     * Tạo JWT Token từ User
     */
    public static function generateToken(User $user, ?int $ttl = null): string
    {
        $now = time();
        $expire = $now + ($ttl ?? self::TTL);

        $payload = [
            'iss' => config('app.url', 'http://127.0.0.1:8000'), // Issuer
            'iat' => $now,                                      // Issued at
            'nbf' => $now,                                      // Not before
            'exp' => $expire,                                   // Expiration time
            'sub' => (int) $user->id,                           // Subject (User ID)
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ];

        return JWT::encode($payload, self::getSecret(), self::ALGO);
    }

    /**
     * Giải mã và xác thực JWT Token
     * Trả về payload object nếu hợp lệ, ngược lại trả về null
     */
    public static function verifyToken(string $token): ?object
    {
        try {
            return JWT::decode($token, new Key(self::getSecret(), self::ALGO));
        } catch (Throwable $e) {
            return null;
        }
    }

    /**
     * Lấy User tương ứng từ JWT Token
     */
    public static function getUserFromToken(string $token): ?User
    {
        $payload = self::verifyToken($token);
        if (!$payload || empty($payload->sub)) {
            return null;
        }

        return User::find($payload->sub);
    }
}

