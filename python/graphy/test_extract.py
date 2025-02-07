from extractor import PaperExtractor

file_path = "inputs/fix/arxiv_complexity_of_mechanism_design.pdf"

paper_extractor = PaperExtractor(
    file_path,
)
paper_extractor.set_img_path("inputs/cell/img/")

res = paper_extractor.extract_all()
print(res)
