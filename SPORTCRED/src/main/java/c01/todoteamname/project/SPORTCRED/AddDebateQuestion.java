package c01.todoteamname.project.SPORTCRED;

import java.io.IOException;
import org.json.JSONException;
import org.json.JSONObject;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

public class AddDebateQuestion implements HttpHandler {

  final static String password = "SPORTCRED IS VERY COOL, YES IT IS";
  Neo4JDB nb = Neo4JDB.createInstanceOfDatabase();

  public AddDebateQuestion() {}

  @Override
  public void handle(HttpExchange r) {
    try {
      if (r.getRequestMethod().equals("PUT")) {
        handlePut(r);
      }
    } catch (Exception e) {
      try {
        r.sendResponseHeaders(500, -1);
      } catch (IOException e1) {
      }
    }
  }

  public void handlePut(HttpExchange r) throws IOException, JSONException {
    String body = Utils.convert(r.getRequestBody());
    JSONObject deserialized = new JSONObject(body);
    String question;
    String rank;

    if (deserialized.has("question") && deserialized.has("rank") && deserialized.has("password")) {
      question = deserialized.getString("question");
      rank = deserialized.getString("rank");
      if (deserialized.get("password").equals(password)) {
        this.nb.storeDebateQuestion(r, question, rank);
        r.sendResponseHeaders(200, -1);
      } else {
        r.sendResponseHeaders(400, -1);
      }
    }

    else {
      r.sendResponseHeaders(400, -1);
    }

  }

}
