<?php

namespace App\Http\Middleware;

use App\Services\JwtService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateApi
{
    /**
     * Handle an incoming request with JWT validation.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['message' => 'Unauthorized. Token missing.'], 401);
        }

        // Xác thực bằng JSON Web Token (JWT)
        $user = JwtService::getUserFromToken($token);

        if (!$user) {
            return response()->json(['message' => 'Unauthorized. Invalid or expired token.'], 401);
        }

        // Gán user đã xác thực vào Auth context của Laravel
        auth()->setUser($user);

        return $next($request);
    }
}
