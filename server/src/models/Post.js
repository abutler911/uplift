const mongoose = require("mongoose");
const slugify = require("slugify");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    type: { type: String, enum: ["original", "curated"], default: "original" },
    category: {
      type: String,
      enum: [
        "Small Wins",
        "The Big Picture",
        "Silver Linings",
        "The Helpers",
        "Humanity 101",
      ],
      required: true,
    },
    excerpt: { type: String, trim: true },
    body: { type: String, required: true },
    sourceUrl: { type: String, trim: true },
    sourceLabel: { type: String, trim: true },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    publishedAt: { type: Date },
  },
  { timestamps: true },
);

postSchema.pre("save", async function (next) {
  if (!this.slug || this.isModified("title")) {
    let base = slugify(this.title, { lower: true, strict: true });
    let slug = base;
    let count = 1;
    while (
      await mongoose.model("Post").findOne({ slug, _id: { $ne: this._id } })
    ) {
      slug = `${base}-${count++}`;
    }
    this.slug = slug;
  }
  if (this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

module.exports = mongoose.model("Post", postSchema);
