def parse_command(text: str):
    t = text.lower()

    if "create" in t or "new note" in t:
        return {"action": "CREATE", "content": t}
    if "update" in t:
        return {"action": "UPDATE", "content": t}
    if "delete" in t:
        return {"action": "DELETE", "content": t}
    if "search" in t:
        return {"action": "SEARCH", "keyword": t.replace("search", "").strip()}

    return {"action": "UNKNOWN", "content": t}
