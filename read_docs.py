import zipfile, xml.etree.ElementTree as ET, sys, os

def get_docx_text(path):
    try:
        with zipfile.ZipFile(path) as docx:
            xml_content = docx.read("word/document.xml")
            tree = ET.XML(xml_content)
            result = []
            for node in tree.iter():
                if node.tag.endswith("}t") and node.text:
                    result.append(node.text)
            return "\n".join(result)
    except Exception as e:
        return str(e)

docs_dir = "c:/Users/pwrob/OneDrive/Documents/oniongrade-ai/docs"
with open("c:/Users/pwrob/OneDrive/Documents/oniongrade-ai/docs_content.txt", "w", encoding="utf-8") as f:
    for doc in os.listdir(docs_dir):
        if doc.endswith(".docx"):
            f.write(f"========== {doc} ==========\n")
            f.write(get_docx_text(os.path.join(docs_dir, doc)))
            f.write("\n\n")
