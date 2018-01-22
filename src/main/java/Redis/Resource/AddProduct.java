package Redis.Resource;

import Redis.Main;
import redis.clients.jedis.Jedis;

public class AddProduct {
    public AddProduct(String name){
        Main.pid++;
        String id = Main.pid.toString();
        Jedis jedis = new Jedis();
        jedis.hset(id,"productName",name);
        jedis.hset(id,"viewed","0");
        jedis.hset(id,"ordered","0");
        jedis.hset(id,"inCart","0");

    }
}
