package c01.todoteamname.project.SPORTCRED;

import java.io.IOException;
import java.io.OutputStream;
import java.util.Map;
import org.json.JSONException;
import org.json.JSONObject;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

public class GetDebateQuestions implements HttpHandler {

  Neo4JDB nb = Neo4JDB.createInstanceOfDatabase();

  public GetDebateQuestions() {}

  @Override
  public void handle(HttpExchange r) {
    try {
      if (r.getRequestMethod().equals("POST")) {
    	r.getResponseHeaders().add("Access-Control-Allow-Origin", "*");

        handlePost(r);
      }
    } catch (Exception e) {
      try {
        r.sendResponseHeaders(500, -1);
      } catch (IOException e1) {
      }
    }
  }

  public void handlePost(HttpExchange r) throws IOException, JSONException {
    String body = Utils.convert(r.getRequestBody());
    JSONObject deserialized = new JSONObject(body);
    int score;
    String rank = "FANALYST";

    if (deserialized.has("score")) {
      score = Integer.parseInt(deserialized.getString("score"));

      if (score > 900) {
        rank = "EXPERT ANALYST";
      } else if (score > 600) {
        rank = "PRO ANALYST";
      } else if (score > 300) {
        rank = "ANALYST";
      }


      Map<String, Object> resultMap = this.nb.getRankBasedQuestions(r, rank);
      JSONObject json = new JSONObject(resultMap);
      String response = json.toString();
      r.getResponseHeaders().set("Content-Type", "application/json");
      r.sendResponseHeaders(200, response.length());
      OutputStream os = r.getResponseBody();
      os.write(response.getBytes());
      os.close();

    }

    else {
      r.sendResponseHeaders(400, -1);
    }

  }
}
