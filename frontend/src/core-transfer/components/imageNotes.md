🖼️ Handling Images (Assets) – Notes from Integration
1. Τι επιστρέφει το backend

Από το Django backend (StatementSerializer + content_model):

{
  "content": {
    "prompt_asset_id": 42
  }
}

👉 Σημαντικό:

Το backend δίνει μόνο ID
❌ ΔΕΝ δίνει image URL
❌ ΔΕΝ δίνει path
2. Πού βρίσκονται τα images

Από Django admin:

quizzes/assets/ec55350f-...jpg

👉 Αυτό σημαίνει:

/media/quizzes/assets/...

✔ Τα images σερβίρονται από:

http://127.0.0.1:8000/media/...
3. Τι ΔΕΝ δουλεύει

❌ Αυτά είναι λάθος:

/assets/${id}.jpg
/static/${id}.jpg

👉 γιατί:

τα images δεν είναι static
δεν έχουν naming based on id
4. Τι δουλεύει

✔ Σωστό path:

src="/media/quizzes/assets/filename.jpg"
5. Πρόβλημα αρχιτεκτονικής

👉 Το frontend έχει:

prompt_asset_id: number

👉 Αλλά χρειάζεται:

image: string
6. Προσωρινή λύση (dev only)

Mapping στο frontend:

const assetMap: Record<number, string> = {
  1: 'quizzes/assets/xxx.jpg'
}

και:

src={`/media/${assetMap[assetId]}`}
7. Σωστή λύση (backend fix)

Το backend πρέπει να επιστρέφει:

{
  "prompt_asset": {
    "id": 1,
    "image": "quizzes/assets/xxx.jpg"
  }
}
8. Τελική χρήση στο frontend
<img src={`/media/${question.content.prompt_asset.image}`} />
9. Debug strategy που χρησιμοποιήθηκε

✔ Hardcoded image test:

<img src="/media/quizzes/assets/xxx.jpg" />

✔ Direct browser test:

http://127.0.0.1:8000/media/...

👉 Αυτό επιβεβαίωσε:

media pipeline δουλεύει
πρόβλημα είναι μόνο data shape
10. Συμπέρασμα
Backend → incomplete contract (id only)
Frontend → δεν μπορεί να μαντέψει path
Media system → δουλεύει σωστά

👉 Άρα:
χρειάζεται backend αλλαγή, όχι frontend workaround