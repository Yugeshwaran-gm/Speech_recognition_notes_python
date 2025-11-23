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
def parse_command(text: str):
    """
    Convert English text into a CRUD action.
    """
    words = text.lower()

    # CREATE note
    if "create" in words or "new note" in words or "make note" in words:
        content = words.replace("create", "").replace("new note", "").strip()
        return {"action": "CREATE", "content": content}

    # UPDATE note <id>
    if "update" in words or "edit note" in words:
        note_id = extract_number(words)
        updated_text = extract_after_keyword(words, ["update", "edit note"])
        return {"action": "UPDATE", "note_id": note_id, "content": updated_text}

    # DELETE note <id>
    if "delete" in words or "remove note" in words:
        note_id = extract_number(words)
        return {"action": "DELETE", "note_id": note_id}

    # SEARCH notes
    if "search" in words or "find" in words:
        keyword = extract_after_keyword(words, ["search", "find"])
        return {"action": "SEARCH", "keyword": keyword}

    # FALLBACK → Just create a new note
    return {"action": "CREATE", "content": text}


def extract_number(text: str):
    for word in text.split():
        if word.isdigit():
            return int(word)
    return None


def extract_after_keyword(text: str, keywords: list):
    for key in keywords:
        if key in text:
            return text.split(key, 1)[1].strip()
    return text
