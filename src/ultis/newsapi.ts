import { Article } from "@/type/news";

const apiKey = '37fa5628eb0000a9118b503e87f0d35f';
const baseUrl = 'https://gnews.io/api/v4/search';
const query = 'nông nghiệp'; // Từ khóa tìm kiếm


export async function fetchVietnameseNews(): Promise<Article[]> {
    const url = `${baseUrl}?q=${encodeURIComponent(query)}&lang=vi&token=${apiKey}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json(); // Dữ liệu trả về
        return data.articles; // Trả về danh sách bài viết
    } catch (error) {
        console.error('Error fetching news:', error);
        return []; // Đảm bảo trả về mảng rỗng nếu có lỗi
    }
}

