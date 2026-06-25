package com.shopapp.controller;

import com.shopapp.model.CartItem;
import com.shopapp.service.CartService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // In a real app the sessionId comes from a cookie / JWT.
    // For this assignment we accept it as a header: X-Session-Id
    private static final String DEFAULT_SESSION = "default-session";

    private String session(@RequestHeader(value = "X-Session-Id", defaultValue = DEFAULT_SESSION) String s) {
        return s;
    }

    // GET /api/cart
    @GetMapping
    public ResponseEntity<List<CartItem>> getCart(
            @RequestHeader(value = "X-Session-Id", defaultValue = DEFAULT_SESSION) String sessionId) {
        return ResponseEntity.ok(cartService.getCartItems(sessionId));
    }

    // POST /api/cart/add  { "productId": 3 }
    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(
            @RequestHeader(value = "X-Session-Id", defaultValue = DEFAULT_SESSION) String sessionId,
            @RequestBody AddToCartRequest req) {
        return ResponseEntity.ok(cartService.addToCart(sessionId, req.getProductId()));
    }

    // PUT /api/cart/update  { "productId": 3, "quantity": 5 }
    @PutMapping("/update")
    public ResponseEntity<?> updateQuantity(
            @RequestHeader(value = "X-Session-Id", defaultValue = DEFAULT_SESSION) String sessionId,
            @RequestBody UpdateCartRequest req) {
        var updated = cartService.updateQuantity(sessionId, req.getProductId(), req.getQuantity());
        return updated.map(ResponseEntity::ok)
                .orElse(ResponseEntity.ok().build());
    }

    // DELETE /api/cart/remove/{productId}
    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Void> removeFromCart(
            @RequestHeader(value = "X-Session-Id", defaultValue = DEFAULT_SESSION) String sessionId,
            @PathVariable Long productId) {
        cartService.removeFromCart(sessionId, productId);
        return ResponseEntity.noContent().build();
    }

    // DELETE /api/cart/clear
    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(
            @RequestHeader(value = "X-Session-Id", defaultValue = DEFAULT_SESSION) String sessionId) {
        cartService.clearCart(sessionId);
        return ResponseEntity.noContent().build();
    }

    // GET /api/cart/totals
    @GetMapping("/totals")
    public ResponseEntity<Map<String, Double>> getTotals(
            @RequestHeader(value = "X-Session-Id", defaultValue = DEFAULT_SESSION) String sessionId) {
        double before   = cartService.getTotalBeforeDiscount(sessionId);
        double after    = cartService.getTotalAfterDiscount(sessionId);
        return ResponseEntity.ok(Map.of(
                "totalBeforeDiscount", before,
                "totalAfterDiscount",  after,
                "totalSavings",        before - after
        ));
    }

    // ── DTOs ─────────────────────────────────────────────────────────────────

    @Data
    static class AddToCartRequest {
        private Long productId;
    }

    @Data
    static class UpdateCartRequest {
        private Long    productId;
        private Integer quantity;
    }
}
