package com.dp.training;

public final class Demo {
    private Demo() {}

    public static void main(String[] args) {
        String learner = args.length > 0 ? args[0] : "curious learner";
        System.out.printf("Hello, %s! Your Java journey starts here.%n", learner);
    }
}
