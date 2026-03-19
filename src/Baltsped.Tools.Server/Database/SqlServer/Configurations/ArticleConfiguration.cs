using Baltsped.Tools.Server.Database.SqlServer.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Baltsped.Tools.Server.Database.SqlServer.Configurations;

// Конфигурация таблицы Article и связей для EF Core
internal class ArticleConfiguration : IEntityTypeConfiguration<Article>
{
    public void Configure(EntityTypeBuilder<Article> builder)
    {
        builder.ToTable("Article", "dbo");

        builder.HasKey(x => x.ItemId);

        builder.Property(x => x.ItemId)
            .HasColumnName("ItemId");

        builder.Property(x => x.Code)
            .HasColumnName("Code")
            .HasMaxLength(128);

        builder.Property(x => x.Barcode)
            .HasColumnName("Barcodes")
            .HasMaxLength(128);

        builder.Property(x => x.BatchId)
            .HasColumnName("Batch_id");

        builder.Property(x => x.ContainerId)
            .HasColumnName("Container_id");

        builder.Property(x => x.TargetId)
            .HasColumnName("Target_id");

        builder.Property(x => x.TimeInducted)
            .HasColumnName("TimeInducted");

        builder.Property(x => x.TimeSorted)
            .HasColumnName("TimeSorted");

        builder.HasOne(x => x.Batch)
            .WithMany(x => x.Articles)
            .HasForeignKey(x => x.BatchId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Container)
            .WithMany(x => x.Articles)
            .HasForeignKey(x => x.ContainerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Target)
            .WithMany(x => x.Articles)
            .HasForeignKey(x => x.TargetId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
