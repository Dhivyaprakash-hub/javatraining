package com.dp.training;

/** Demonstrates widening and narrowing primitive numeric conversions. */
public final class Typecasting {
    private Typecasting() {}

    public static void main(String[] args) {
        byte smallValue = 100;
        int widenedToInt = smallValue * 2;
        long widenedToLong = widenedToInt + 2L;
        double widenedToDouble = widenedToLong + smallValue;

        double decimal = 9.8;
        int narrowedToInt = (int) decimal;

        System.out.printf("Widened value: %.1f%n", widenedToDouble);
        System.out.printf("Casting 9.8 to int truncates to %d%n", narrowedToInt);
    }
}
