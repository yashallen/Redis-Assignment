package Redis;
import Redis.Functions.NewArrivals;
import Redis.Functions.NonPerforming;
import Redis.Functions.TopSelling;
import Redis.Functions.Trending;
import Redis.Resource.AddProduct;
import Redis.Resource.AddProductToCart;
import Redis.Resource.OrderProduct;
import Redis.Resource.ViewProduct;

import java.util.Scanner;

public class Main {
    public static Integer pid = 0;
        public static void main(String[] args) {
            while(true){
                System.out.println("\n\nChoose one Option: \n" +
                        "1. AddProduct(Please give a name)\n" +
                        "2. ViewProduct(Please give a productId)\n" +
                        "3. AddToCart(Please give a productId)\n"+
                        "4. OrderProduct(Please give a productId)\n" +
                        "5. TopSelling\n" +
                        "6. TopTrending\n" +
                        "7. NonPerforming\n" +
                        "8. New Arrivals\n" +
                        "9. Exit \n");
                Scanner sc=new Scanner(System.in);
                Integer choice = sc.nextInt();
                if(choice == 1){
                    String name = sc.next();
                    AddProduct obj = new AddProduct(name);
                }else if(choice == 2){
                    String ch = sc.next();
                    ViewProduct obj = new ViewProduct(ch);
                }else if(choice == 3){
                    String ch = sc.next();
                    AddProductToCart obj = new AddProductToCart(ch);
                }else if(choice == 4){
                    String ch = sc.next();
                    OrderProduct obj = new OrderProduct(ch);
                }else if(choice == 5){
                    TopSelling obj = new TopSelling();
                }else if(choice == 6){
                    Trending obj = new Trending();
                }else if(choice == 7){
                    NonPerforming obj = new NonPerforming();
                }else if(choice == 8){
                    NewArrivals obj = new NewArrivals();
                }else if(choice == 9)
                    break;
                }
            }
        }
