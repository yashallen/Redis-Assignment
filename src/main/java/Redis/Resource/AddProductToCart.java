package Redis.Resource;


import redis.clients.jedis.Jedis;

public class AddProductToCart {
    public AddProductToCart(String id){
        Jedis jedis = new Jedis();
        String name = jedis.hget(id, "inCart");
        Integer val = Integer.parseInt(name);
        val++;
        jedis.hset(id,"inCart",val.toString());
    }

}
