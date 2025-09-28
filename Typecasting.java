package com.dp.training;

public class Typecasting {
	public static void main(String[] args) {
		byte b=100;
		int x= b*2; //upcasting
		long y= x+2; //upcasting
		float a=x+y+b;
		double num =a *2;
		System.out.println(num);
		
		float num1= (float)(num/2);
		int num2=(int)(num1+10);
		int num3=(int)(num2+20);
		System.out.println(num3);
		}

}
