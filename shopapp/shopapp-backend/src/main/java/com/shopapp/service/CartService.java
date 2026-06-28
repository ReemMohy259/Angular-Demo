package com.shopapp.service;

import com.shopapp.model.CartItem;
import com.shopapp.model.Product;
import com.shopapp.repository.CartItemRepository;
import com.shopapp.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository  productRepository;

    // ── Read ─────────────────────────────────────────────────────────────────

    public List<CartItem> getCartItems(String sessionId) {
        return cartItemRepository.findBySessionId(sessionId);
    }

    // ── Add / update ─────────────────────────────────────────────────────────

    @Transactional
    public CartItem addToCart(String sessionId, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

        Optional<CartItem> existing =
                cartItemRepository.findBySessionIdAndProductId(sessionId, productId);

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + 1);
            return cartItemRepository.save(item);
        } else {
            CartItem newItem = CartItem.builder()
                    .sessionId(sessionId)
                    .product(product)
                    .quantity(1)
                    .build();
            return cartItemRepository.save(newItem);
        }
    }

    @Transactional
    public Optional<CartItem> updateQuantity(String sessionId, Long productId, int quantity) {
        if (quantity <= 0) {
            removeFromCart(sessionId, productId);
            return Optional.empty();
        }
        return cartItemRepository
                .findBySessionIdAndProductId(sessionId, productId)
                .map(item -> {
                    item.setQuantity(quantity);
                    return cartItemRepository.save(item);
                });
    }

    // ── Remove ────────────────────────────────────────────────────────────────

    @Transactional
    public void removeFromCart(String sessionId, Long productId) {
        cartItemRepository.deleteBySessionIdAndProductId(sessionId, productId);
    }

    @Transactional
    public void clearCart(String sessionId) {
        cartItemRepository.deleteBySessionId(sessionId);
    }

    // ── Totals ────────────────────────────────────────────────────────────────

    public double getTotalBeforeDiscount(String sessionId) {
        return cartItemRepository.findBySessionId(sessionId).stream()
                .mapToDouble(i -> i.getProduct().getOriginalPrice() * i.getQuantity())
                .sum();
    }

    public double getTotalAfterDiscount(String sessionId) {
        return cartItemRepository.findBySessionId(sessionId).stream()
                .mapToDouble(i -> i.getProduct().getPrice() * i.getQuantity())
                .sum();
    }
}
