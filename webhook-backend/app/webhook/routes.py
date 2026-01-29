from flask import Blueprint, request, jsonify
from datetime import datetime
from app.extensions import events_collection

webhook = Blueprint('Webhook', __name__, url_prefix='/webhook')

@webhook.route('/receiver', methods=["POST"])
def github_actions():
    payload = request.json
    event_type = request.headers.get("X-GitHub-Event")

    if event_type == "push":
        event = handle_push(payload)

    elif event_type == "pull_request":
        event = handle_pull_request(payload)

    else:
        # other events 
        return jsonify({"status": "ignored"}), 200

    # storing in MongoDB
    events_collection.insert_one(event)

    return jsonify({"status": "success"}), 200


def handle_push(payload):
    return {
        "request_id": payload.get("after"),
        "author": payload["pusher"]["name"],
        "action": "PUSH",
        "from_branch": None,
        "to_branch": payload["ref"].split("/")[-1],
        "timestamp": datetime.utcnow()
    }


def handle_pull_request(payload):
    pr = payload["pull_request"]
    action = payload.get("action")

    # optional: treat merged PR as MERGE event
    if action == "closed" and pr.get("merged"):
        action_type = "MERGE"
    else:
        action_type = "PULL_REQUEST"

    return {
        "request_id": pr["id"],
        "author": pr["user"]["login"],
        "action": action_type,
        "from_branch": pr["head"]["ref"],
        "to_branch": pr["base"]["ref"],
        "timestamp": datetime.utcnow()
    }


@webhook.route("/events", methods=["GET"])
def get_events():
    events = list(
        events_collection
        .find({}, {"_id": 0})
        .sort("timestamp", -1)
        .limit(10)
    )

    return jsonify(events), 200