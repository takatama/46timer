import { Card, CardContent, Link, List, ListItem, ListItemText, Typography } from "@mui/material";
import type { NewsItem } from "../hooks/useCoffeeNews";
import type { TranslationType } from "../types";

export function CoffeeNews({ t, news, loading, failed }: { t: TranslationType; news: NewsItem[]; loading: boolean; failed: boolean }) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 3, mb: 2.5 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={800}>{t.newsTitle}</Typography>
        {loading && <Typography color="text.secondary">{t.newsLoading}</Typography>}
        {(failed || (!loading && news.length === 0)) && <Typography color="text.secondary">{t.newsUnavailable}</Typography>}
        {!loading && news.length > 0 && (
          <List disablePadding>
            {news.slice(0, 5).map((item) => (
              <ListItem key={item.id} disableGutters divider>
                <ListItemText
                  primary={<Link href={item.url} target="_blank" rel="noopener noreferrer" underline="hover">{item.short_title}</Link>}
                  secondary={item.source}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
